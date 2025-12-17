# Pitt's official grade scale
GRADE_SCALE = {
    'A+': 4.00, 'A': 4.00, 'A-': 3.75,
    'B+': 3.25, 'B': 3.00, 'B-': 2.75,
    'C+': 2.25, 'C': 2.00, 'C-': 1.75,
    'D+': 1.25, 'D': 1.00, 'D-': 0.75,
    'F': 0.00
}


def calculate_gpa_from_file(filename):
    """Read courses from file and calculate GPA"""
    courses = []
    total_credits = 0.0
    total_quality_points = 0.0
    
    print("\n" + "="*90)
    print("UNIVERSITY OF PITTSBURGH GPA CALCULATOR")
    print("="*90)
    print(f"\n📂 Reading from: {filename}\n")
    
    try:
        with open(filename, 'r') as f:
            lines = f.readlines()
        
        for line_num, line in enumerate(lines, 1):
            line = line.strip()
            
            # Skip empty lines and comments
            if not line or line.startswith('#'):
                continue
            
            try:
                # Parse: "Course Name" CREDITS GRADE
                if '"' in line:
                    # Find the course name in quotes
                    start = line.index('"')
                    end = line.index('"', start + 1)
                    course_name = line[start+1:end]
                    rest = line[end+1:].strip().split()
                else:
                    # No quotes, assume first word is name
                    parts = line.split()
                    course_name = parts[0]
                    rest = parts[1:]
                
                if len(rest) != 2:
                    print(f"⚠️  Line {line_num}: Invalid format - need CREDITS GRADE")
                    continue
                
                credits = float(rest[0])
                grade = rest[1].upper()
                
                if grade not in GRADE_SCALE:
                    print(f"⚠️  Line {line_num}: Invalid grade '{grade}'")
                    continue
                
                grade_value = GRADE_SCALE[grade]
                quality_points = credits * grade_value
                
                courses.append({
                    'name': course_name,
                    'credits': credits,
                    'grade': grade,
                    'grade_value': grade_value,
                    'quality_points': quality_points
                })
                
                total_credits += credits
                total_quality_points += quality_points
                
            except (ValueError, IndexError) as e:
                print(f"⚠️  Line {line_num}: Error parsing '{line}'")
        
        # Display results
        print("="*90)
        print(f"{'Course Name':<40} {'Credits':>8} {'Grade':>6} {'Value':>8} {'Quality Points':>15}")
        print("-"*90)
        
        for i, course in enumerate(courses, 1):
            print(f"{i:2}. {course['name']:<37} {course['credits']:>5.2f} cr  "
                  f"{course['grade']:>3}  ({course['grade_value']:.2f})  =  {course['quality_points']:>6.2f} QP")
        
        print("-"*90)
        print(f"{'TOTAL':<40} {total_credits:>5.2f} cr{' '*14}= {total_quality_points:>6.2f} QP")
        print("="*90)
        
        if total_credits > 0:
            gpa = total_quality_points / total_credits
            print(f"\nGPA CALCULATION:")
            print(f"  Total Quality Points: {total_quality_points:.3f}")
            print(f"  Total Credits:        {total_credits:.3f}")
            print(f"  GPA = {total_quality_points:.3f} ÷ {total_credits:.3f} = {gpa:.3f}")
            print(f"\n  FINAL GPA: {gpa:.3f}")
        else:
            print("\n❌ No valid courses found!")
        
        print("="*90 + "\n")
        
    except FileNotFoundError:
        print(f"❌ Error: File '{filename}' not found!\n")
    except Exception as e:
        print(f"❌ Error: {e}\n")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 2:
        print("\nUsage: python3 pittGPA.py <grades_file.txt>")
        print('\nFile format: "Course Name" CREDITS GRADE')
        print('Example:')
        print('  "Big Ideas in Computing" 4 A+')
        print('  "Discrete Structures" 3 A')
        print('  "Calculus 2" 4 B-\n')
        sys.exit(1)
    
    calculate_gpa_from_file(sys.argv[1])
